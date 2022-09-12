import { VirtualDOM, HTMLElement$, render } from '@youwol/flux-view'
import { BehaviorSubject, merge, Observable } from 'rxjs'
import { Modal } from '@youwol/fv-group'
import { map, mergeMap, take } from 'rxjs/operators'
import { CodeIdeState, TsCodeEditorView } from '@youwol/fv-code-mirror-editors'
import { FluxBackend, request$, onHTTPErrors } from '@youwol/http-clients'

const defaultMetadata = {
    name: '>TBD<',
    displayName: '>TBD<',
    version: '>TBD<',
    execution: {
        standalone: true,
        parametrized: [
            /*{
            "match":{
               "kind":"story"
            } // can be e.g.: { "match": (asset) => asset.name.endsWith(".my-extension") },
            "parameters":{
               "id":"rawId"
            }
         }*/
        ],
    },
    graphics: {
        appIcon: {
            class: 'fas fa-book fa-2x',
        },
        fileIcon: {
            class: 'fas fa-book',
        },
        background: {},
    },
}

export class PublishAppState implements VirtualDOM {
    public readonly name$: BehaviorSubject<string>
    public readonly title$: BehaviorSubject<string>
    public readonly version$: BehaviorSubject<string>

    constructor({
        name,
        title,
        version,
    }: {
        name: string
        title: string
        version: string
    }) {
        this.name$ = new BehaviorSubject(name)
        this.title$ = new BehaviorSubject(title)
        this.version$ = new BehaviorSubject(version)
    }
}

function createEditor(tsSrcs: string, codeEditorsModule) {
    const ideState: CodeIdeState = new codeEditorsModule.CodeIdeState({
        files: {
            path: './index.ts',
            content: tsSrcs,
        },
        entryPoint: './index.ts',
    })
    const view: TsCodeEditorView = new codeEditorsModule.TsCodeEditorView({
        ideState,
    })
    view.nativeEditor$.subscribe((editor) => {
        editor.refresh()
    })
    return view
}

function metadataToSrc(metadata: { [k: string]: unknown }) {
    return `return () => (\n\t ${JSON.stringify(metadata, null, 4).replace(
        /">TBD<"/g,
        '',
    )} )\n`
}

export class FindTemplateView implements VirtualDOM {
    public readonly class =
        'd-flex justify-content-center mb-2 align-items-center'
    public readonly children: VirtualDOM[]
    public readonly codeIdeState: CodeIdeState
    constructor(params: { codeIdeState: CodeIdeState }) {
        Object.assign(this, params)
        this.children = [
            {
                innerText: 'find template',
                class: 'fv-text-primary mx-2',
            },
            {
                tag: 'input',
                type: 'text',
                onkeypress: (ev: KeyboardEvent) => {
                    const target = ev.target as HTMLInputElement
                    const resourceId = window.btoa(target.value)
                    if (ev.key == 'Enter') {
                        request$(
                            new Request(
                                `/api/assets-gateway/cdn-backend/resources/${resourceId}/latest/.yw_metadata.json`,
                            ),
                        )
                            .pipe(
                                onHTTPErrors(() => defaultMetadata),
                                map((respJson: { [k: string]: unknown }) => {
                                    delete respJson['family']
                                    return {
                                        name: target.value,
                                        version: '>TBD<',
                                        ...respJson,
                                    }
                                }),
                            )
                            .subscribe((resp: { [k: string]: unknown }) => {
                                const content = metadataToSrc(resp)
                                this.codeIdeState.currentFile$.next({
                                    path: `./index${Math.random() * 1e6}.ts`,
                                    content,
                                })
                            })
                    }
                },
            },
            {
                tag: 'i',
                class: 'fas fa-search mx-2 fv-text-primary',
            },
        ]
    }
}
export function popupModal(
    codeEditorsModule,
): Observable<FluxBackend.PublishApplicationBody> {
    const modalState = new Modal.State()
    const validateBtn = {
        class: 'w-100 d-flex justify-content-center',
        children: [
            {
                class: 'border fv-bg-secondary rounded p-1 fv-pointer fv-hover-xx-lighter fv-text-primary fv-btn mt-2',
                children: [
                    {
                        class: 'fas fa-box',
                    },
                ],
                onclick: (ev) => {
                    modalState.ok$.next(ev)
                },
            },
        ],
    }
    const editor = createEditor(
        metadataToSrc(defaultMetadata),
        codeEditorsModule,
    )

    const modalView = new Modal.View({
        state: modalState,
        contentView: () => {
            return {
                class: 'd-flex flex-column',
                style: {
                    width: '75vw',
                    height: '75vh',
                },
                children: [
                    {
                        class: 'flex-grow-1',
                        children: [
                            new FindTemplateView({
                                codeIdeState: editor.ideState,
                            }),
                        ],
                    },
                    editor,
                    validateBtn,
                ],
                onclick: (ev: MouseEvent) => ev.stopPropagation(),
            }
        },
        connectedCallback: (elem: HTMLDivElement & HTMLElement$) => {
            elem.children[0].classList.add('w-100')
            // https://stackoverflow.com/questions/63719149/merge-deprecation-warning-confusion
            merge(...[modalState.cancel$, modalState.ok$])
                .pipe(take(1))
                .subscribe(() => {
                    modalDiv.remove()
                })
        },
    })
    const modalDiv = render(modalView)
    document.querySelector('body').appendChild(modalDiv)

    return modalState.ok$.pipe(
        mergeMap(() => {
            return editor.ideState.parseCurrentFile$()
        }),
        map(({ jsSrc }) => {
            return new Function(jsSrc)()()
        }),
    )
}
