import { applications, assetPreviews, contextMenuActions } from './installer'
import { Installer } from '@youwol/os-core'

export async function install(installer: Installer): Promise<Installer> {
    return installer.with({
        fromManifests: [
            {
                id: '@youwol/installers-flux.basics',
                contextMenuActions,
                assetPreviews,
                applications,
                openWithApps,
                applicationsData: {
                    '@youwol/flux-builder': {
                        toolboxes: [
                            '@youwol/flux-rxjs',
                            '@youwol/flux-fv-widgets',
                            '@youwol/flux-files',
                        ],
                    },
                },
            },
        ],
    })
}
