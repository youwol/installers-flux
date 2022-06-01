import {
    AssetsGateway,
    ExplorerBackend,
    raiseHTTPErrors,
} from '@youwol/http-clients'

export function contextMenuActions({ node, explorer, assetsGtwClient }) {
    return [
        {
            name: 'New flux project',
            icon: 'fas fa-tools',
            authorized: true,
            exe: async () => newFluxProject(node, explorer, assetsGtwClient),
            applicable: () => ExplorerBackend.isInstanceOfFolderResponse(node),
        },
        {
            name: 'Duplicate flux project',
            icon: 'fas fa-clone',
            authorized: true,
            exe: async () =>
                duplicateFluxProject(node, explorer, assetsGtwClient),
            applicable: () =>
                ExplorerBackend.isInstanceOfItemResponse(node) &&
                node.kind == 'flux-project',
        },
    ]
}

export function assetPreviews() {
    return []
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
