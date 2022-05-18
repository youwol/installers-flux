import { Explorer } from '@youwol/platform-essentials'

export function contextMenuActions({ node, explorer, assetsGtwClient }) {
    return [
        {
            name: 'New flux project',
            icon: 'fas fa-play',
            authorized: true,
            exe: async () => newFluxProject(node, explorer, assetsGtwClient),
            applicable: () => node instanceof Explorer.FolderNode,
        },
        {
            name: 'Duplicate flux project',
            icon: 'fas fa-clone',
            authorized: true,
            exe: async () =>
                duplicateFluxProject(node, explorer, assetsGtwClient),
            applicable: () =>
                node instanceof Explorer.ItemNode &&
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

export function openWithApps({ node }) {
    return [
        {
            applicable: () => {
                return node.kind == 'flux-project'
            },
            cdnPackage: '@youwol/flux-builder',
            parameters: { id: node.rawId },
        },
        {
            applicable: () => {
                return node.kind == 'flux-project'
            },
            cdnPackage: '@youwol/flux-runner',
            parameters: { id: node.rawId },
        },
    ]
}

async function newFluxProject(parentNode, explorer, assetsGtwClient) {
    explorer.newAsset({
        parentNode: parentNode,
        pendingName: 'new flux project',
        kind: 'flux-project',
        request: assetsGtwClient.flux.newProject$({
            queryParameters: { folderId: parentNode.id },
            body: { name: 'new flux project' },
        }),
    })
}

async function duplicateFluxProject(projectNode, explorer, assetsGtwClient) {
    assetsGtwClient.treedb
        .getItem$({ itemId: projectNode.id })
        .subscribe((response) => {
            const groupTree = explorer.groupsTree[projectNode.groupId]
            const parentNode = groupTree.getNode(response.folderId)
            explorer.newAsset({
                parentNode: parentNode,
                pendingName: `duplicating ${projectNode.name}`,
                kind: 'flux-project',
                request: assetsGtwClient.flux.duplicate$({
                    projectId: projectNode.rawId,
                    queryParameters: { folderId: parentNode.folderId },
                }),
            })
        })
}
