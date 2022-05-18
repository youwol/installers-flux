import { Core } from '@youwol/platform-essentials'
import { basics } from '..'

export async function install(
    installer: Core.Installer,
): Promise<Core.Installer> {
    return installer.with({
        fromInstallingFunctions: [basics.install],
        fromManifests: [
            {
                id: '@youwol/installers-flux.fluxThree',
                applicationsData: {
                    '@youwol/flux-builder': {
                        toolboxes: ['@youwol/flux-three'],
                    },
                },
            },
        ],
    })
}
