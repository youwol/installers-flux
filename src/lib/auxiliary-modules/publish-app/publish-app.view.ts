import {
    VirtualDOM,
    HTMLElement$,
    render,
    child$,
    attr$,
    Stream$,
} from '@youwol/flux-view'
import { combineLatest, from, merge, Observable, Subject } from 'rxjs'
import { Modal } from '@youwol/fv-group'
import { map, shareReplay, take } from 'rxjs/operators'
import {
    TsCodeEditorModule,
    TypescriptModule,
} from '@youwol/fv-code-mirror-editors'
import { IdeState } from '@youwol/fv-code-mirror-editors/src/lib/typescript/ide.state'
import { request$, onHTTPErrors } from '@youwol/http-clients'
import { LoadingScreenView, CdnEvent } from '@youwol/cdn-client'

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

/**
 * @category State
 */
export class TemplateCreatorState {
    /**
     * @group States
     */
    public readonly ideState: IdeState

    /**
     * @group Modules
     */
    public readonly TsEditorModule: TsCodeEditorModule

    constructor(params: {
        ideState: IdeState
        TsEditorModule: TsCodeEditorModule
    }) {
        Object.assign(this, params)
    }

    findTemplate(name: string) {
        const resourceId = window.btoa(name)

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
                        name,
                        version: '>TBD<',
                        ...respJson,
                    }
                }),
            )
            .subscribe((resp: { [k: string]: unknown }) => {
                const content = metadataToSrc(resp)
                this.ideState.update({
                    path: `./index.ts`,
                    content,
                    updateOrigin: { uid: 'apply-template' },
                })
            })
    }

    parseFile() {
        const tsSrc = this.ideState.fsMap$.getValue().get('./index.ts')
        const jsSrc = this.TsEditorModule.parseTypescript(tsSrc).jsSrc

        console.log('TSSrc', { jsSrc, tsSrc })
        return jsSrc
    }
}

/**
 * @category View
 */
export class TemplateCreatorView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: string = 'w-100 h-100 d-flex flex-column'

    /**
     * @group Immutable DOM Constants
     */
    public readonly children: VirtualDOM[]

    public readonly state: TemplateCreatorState

    constructor({
        TsEditorModule,
        tsSrc,
    }: {
        TsEditorModule: TsCodeEditorModule
        tsSrc: string
    }) {
        const ideState = new TsEditorModule.IdeState({
            files: [
                {
                    path: './index.ts',
                    content: tsSrc,
                },
            ],
        })
        this.state = new TemplateCreatorState({ ideState, TsEditorModule })

        const codeEditorView = new TsEditorModule.CodeEditorView({
            ideState: ideState,
            path: './index.ts',
            config: {},
        })

        this.children = [
            new FindTemplateView({
                state: this.state,
            }),
            {
                class: attr$(
                    ideState.environment$.pipe(take(1)),
                    () => 'd-none',
                    {
                        untilFirst:
                            'd-flex w-100 align-items-center fv-text-primary',
                    },
                ),
                children: [
                    {
                        innerText: 'Loading typescript definitions for linting',
                    },
                    {
                        class: 'fas fa-spinner fa-spin mx-2',
                    },
                ],
            },
            {
                class: 'w-100 flex-grow-1',
                children: [codeEditorView],
            },
        ]
    }
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

    public readonly state: TemplateCreatorState

    constructor(params: { state: TemplateCreatorState }) {
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
                    this.state.findTemplate(target.value)
                },
            },
            {
                tag: 'i',
                class: 'fas fa-search mx-2 fv-text-primary',
            },
        ]
    }
}

export function popupModal() {
    const modalState = new Modal.State()
    const validateBtn = {
        class: 'w-100 d-flex justify-content-center',
        children: [
            {
                class: 'border fv-bg-secondary rounded p-1 fv-pointer fv-hover-xx-lighter fv-text-primary fv-btn mt-2',
                children: [
                    {
                        innerText: 'Publish application',
                    },
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
    const cdnEvent$ = new Subject<CdnEvent>()

    const templateEditor$ = from(
        TypescriptModule({
            installParameters: {
                onEvent: (event) => {
                    cdnEvent$.next(event)
                },
            },
        }),
    ).pipe(
        map((TsEditorModule) => {
            return new TemplateCreatorView({
                tsSrc: metadataToSrc(defaultMetadata),
                TsEditorModule: TsEditorModule,
            })
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
    )

    const loadingView = new LoadingTypescriptView({
        templateEditor$,
        cdnEvent$,
    })

    const modalView = new Modal.View({
        state: modalState,
        contentView: () => {
            return {
                class: 'd-flex flex-column fv-bg-background-alt p-2 rounded border',
                style: {
                    width: '75vw',
                    height: '75vh',
                },
                children: [
                    loadingView,
                    {
                        class: attr$(
                            templateEditor$,
                            () => 'flex-grow-1 w-100',
                            { untilFirst: 'd-none' },
                        ),
                        children: [child$(templateEditor$, (view) => view)],
                    },
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

    return combineLatest([modalState.ok$, templateEditor$]).pipe(
        map(([_, templateEditor]) => {
            const jsSrc = templateEditor.state.parseFile()
            return new Function(jsSrc)()()
        }),
    )
}

/**
 * @category View
 */
export class LoadingTypescriptView implements VirtualDOM {
    /**
     * @group Immutable DOM Constants
     */
    public readonly class: Stream$<unknown, string>

    /**
     * @group Immutable DOM Constants
     */
    public readonly connectedCallback: (elemHTML: HTMLDivElement) => void

    constructor({
        templateEditor$,
        cdnEvent$,
    }: {
        templateEditor$: Observable<unknown>
        cdnEvent$: Observable<CdnEvent>
    }) {
        this.class = attr$(
            templateEditor$,
            () => {
                return 'd-none'
            },
            {
                untilFirst: 'w-100 flex-grow-1',
            },
        )

        this.connectedCallback = (elemHTML: HTMLDivElement) => {
            const loadingScreen = new LoadingScreenView({
                container: elemHTML,
                logo: `<div style='font-size:x-large'>TypeScript</div>`,
                wrapperStyle: {
                    width: '100%',
                    height: '100%',
                    'font-weight': 'bolder',
                },
            })
            loadingScreen.render()
            cdnEvent$.subscribe((ev) => loadingScreen.next(ev))
        }
    }
}
