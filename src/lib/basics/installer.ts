import {
    AssetsGateway,
    ExplorerBackend,
    FluxBackend,
    raiseHTTPErrors,
} from '@youwol/http-clients'
import { FluxDependenciesView } from './flux-dependencies.view'
import { AssetLightDescription } from '@youwol/os-core'
import { mergeMap } from 'rxjs/operators'
import { setup } from '../../auto-generated'

export function contextMenuActions({ node, explorer, assetsGtwClient }) {
    return [
        {
            name: 'New flux project',
            icon: { class: 'fas fa-tools' },
            enabled: () => true,
            exe: async () => newFluxProject(node, explorer, assetsGtwClient),
            applicable: () => ExplorerBackend.isInstanceOfFolderResponse(node),
        },
        {
            name: 'Duplicate flux project',
            icon: { class: 'fas fa-clone' },
            enabled: () => true,
            exe: async () =>
                duplicateFluxProject(node, explorer, assetsGtwClient),
            applicable: () =>
                ExplorerBackend.isInstanceOfItemResponse(node) &&
                node.kind == 'flux-project',
        },
        {
            name: 'Publish as application',
            icon: { class: 'fas fa-clone' },
            enabled: () => true,
            exe: async () =>
                publishFluxProject(node, explorer, assetsGtwClient),
            applicable: () =>
                ExplorerBackend.isInstanceOfItemResponse(node) &&
                node.kind == 'flux-project',
        },
    ]
}

export function assetPreviews({ asset }: { asset: AssetLightDescription }) {
    return [
        {
            icon: 'fas fa-compress-arrows-alt',
            name: 'Dependencies',
            exe: () => {
                return new FluxDependenciesView({ asset })
            },
            applicable: () => {
                return asset.kind == 'flux-project'
            },
        },
    ]
}

export const applications: string[] = [
    '@youwol/flux-builder',
    '@youwol/flux-runner',
]

async function newFluxProject(parentNode, explorer, assetsGtwClient) {
    explorer.newAsset({
        parentNode: parentNode,
        pendingName: 'new flux project',
        type: 'flux-project',
        response$: assetsGtwClient.flux.newProject$({
            queryParameters: { folderId: parentNode.id },
            body: { name: 'new flux project' },
        }),
    })
}

async function duplicateFluxProject(
    projectNode,
    explorer,
    assetsGtwClient: AssetsGateway.Client,
) {
    assetsGtwClient.explorer
        .getItem$({ itemId: projectNode.id })
        .pipe(raiseHTTPErrors())
        .subscribe((response) => {
            const groupTree = explorer.groupsTree[projectNode.groupId]
            const parentNode = groupTree.getNode(response.folderId)
            explorer.newAsset({
                parentNode: parentNode,
                pendingName: `duplicating ${projectNode.name}`,
                type: 'flux-project',
                response$: assetsGtwClient.flux.duplicate$({
                    projectId: projectNode.rawId,
                    queryParameters: { folderId: parentNode.folderId },
                }),
            })
        })
}

type PublishAppModule = typeof import('../auxiliary-modules/publish-app')
async function publishFluxProject(
    projectNode,
    _explorer,
    assetsGtwClient: AssetsGateway.Client,
) {
    const PublishAppModule: PublishAppModule =
        await setup.installAuxiliaryModule({
            name: 'context-menu-publish-app',
            cdnClient: window['@youwol/cdn-client'],
        })
    PublishAppModule.popupModal()
        .pipe(
            mergeMap((body: FluxBackend.PublishApplicationBody) => {
                return assetsGtwClient.flux.publishApplication$({
                    projectId: projectNode.rawId as string,
                    body,
                    queryParameters: {
                        folderId: projectNode.folderId as string,
                    },
                })
            }),
        )
        .subscribe()
}
