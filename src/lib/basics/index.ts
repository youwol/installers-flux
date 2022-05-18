import {
    applications,
    assetPreviews,
    contextMenuActions,
    openWithApps,
} from './installer'
import { Core } from '@youwol/platform-essentials'

export async function install(
    installer: Core.Installer,
): Promise<Core.Installer> {
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
