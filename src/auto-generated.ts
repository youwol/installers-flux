
const runTimeDependencies = {
    "externals": {
        "@youwol/os-core": "^0.1.8",
        "@youwol/flux-view": "^1.0.3",
        "@youwol/cdn-client": "^1.0.2",
        "@youwol/http-clients": "^2.0.5",
        "@youwol/http-primitives": "^0.1.2",
        "rxjs": "^6.5.5",
        "@youwol/fv-button": "^0.1.1",
        "@youwol/fv-code-mirror-editors": "^0.2.1",
        "@youwol/fv-group": "^0.2.1"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/os-core": {
        "commonjs": "@youwol/os-core",
        "commonjs2": "@youwol/os-core",
        "root": "@youwol/os-core_APIv01"
    },
    "@youwol/flux-view": {
        "commonjs": "@youwol/flux-view",
        "commonjs2": "@youwol/flux-view",
        "root": "@youwol/flux-view_APIv1"
    },
    "@youwol/cdn-client": {
        "commonjs": "@youwol/cdn-client",
        "commonjs2": "@youwol/cdn-client",
        "root": "@youwol/cdn-client_APIv1"
    },
    "@youwol/http-clients": {
        "commonjs": "@youwol/http-clients",
        "commonjs2": "@youwol/http-clients",
        "root": "@youwol/http-clients_APIv2"
    },
    "@youwol/http-primitives": {
        "commonjs": "@youwol/http-primitives",
        "commonjs2": "@youwol/http-primitives",
        "root": "@youwol/http-primitives_APIv01"
    },
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv6"
    },
    "@youwol/fv-button": {
        "commonjs": "@youwol/fv-button",
        "commonjs2": "@youwol/fv-button",
        "root": "@youwol/fv-button_APIv01"
    },
    "@youwol/fv-code-mirror-editors": {
        "commonjs": "@youwol/fv-code-mirror-editors",
        "commonjs2": "@youwol/fv-code-mirror-editors",
        "root": "@youwol/fv-code-mirror-editors_APIv02"
    },
    "@youwol/fv-group": {
        "commonjs": "@youwol/fv-group",
        "commonjs2": "@youwol/fv-group",
        "root": "@youwol/fv-group_APIv02"
    },
    "@youwol/fv-code-mirror-editors/src/lib/typescript/ide.state": {
        "commonjs": "@youwol/fv-code-mirror-editors/src/lib/typescript/ide.state",
        "commonjs2": "@youwol/fv-code-mirror-editors/src/lib/typescript/ide.state",
        "root": [
            "@youwol/fv-code-mirror-editors_APIv02",
            "src",
            "lib",
            "typescript",
            "ide.state"
        ]
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv6",
            "operators"
        ]
    }
}
const exportedSymbols = {
    "@youwol/os-core": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/os-core"
    },
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "@youwol/cdn-client": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/cdn-client"
    },
    "@youwol/http-clients": {
        "apiKey": "2",
        "exportedSymbol": "@youwol/http-clients"
    },
    "@youwol/http-primitives": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/http-primitives"
    },
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/fv-button": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/fv-button"
    },
    "@youwol/fv-code-mirror-editors": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-code-mirror-editors"
    },
    "@youwol/fv-group": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-group"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./lib/index.ts",
    "loadDependencies": [
        "@youwol/os-core",
        "@youwol/flux-view",
        "@youwol/http-clients",
        "rxjs",
        "@youwol/fv-button"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {
    "context-menu-publish-app": {
        "entryFile": "./lib/auxiliary-modules/publish-app/index.ts",
        "loadDependencies": [
            "@youwol/fv-code-mirror-editors",
            "@youwol/fv-group",
            "@youwol/cdn-client"
        ],
        "name": "context-menu-publish-app"
    }
}

const entries = {
     '@youwol/installers-flux': './lib/index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/installers-flux/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/installers-flux',
        assetId:'QHlvdXdvbC9pbnN0YWxsZXJzLWZsdXg=',
    version:'0.1.3',
    shortDescription:"Collections of installers related to the flux application of YouWol",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/installers-flux',
    npmPackage:'https://www.npmjs.com/package/@youwol/installers-flux',
    sourceGithub:'https://github.com/youwol/installers-flux',
    userGuide:'https://l.youwol.com/doc/@youwol/installers-flux',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<Window>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/installers-flux_APIv01`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<Window>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/installers-flux#0.1.3~dist/@youwol/installers-flux/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/installers-flux/${entry.name}_APIv01`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
