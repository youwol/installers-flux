import { Installer } from '@youwol/os-core'
import { basics } from '..'

export async function install(installer: Installer): Promise<Installer> {
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
