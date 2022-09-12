
const runTimeDependencies = {
    "load": {
        "@youwol/os-core": "^0.1.0",
        "@youwol/flux-view": "^1.0.0",
        "@youwol/http-clients": "^1.0.1",
        "rxjs": "^6.5.5",
        "@youwol/fv-button": "^0.1.0"
    },
    "differed": {
        "@youwol/fv-code-mirror-editors": "^0.1.0",
        "@youwol/fv-group": "^0.2.0"
    },
    "includedInBundle": []
}
const externals = {
    "@youwol/os-core": "@youwol/os-core_APIv01",
    "@youwol/flux-view": "@youwol/flux-view_APIv1",
    "@youwol/http-clients": "@youwol/http-clients_APIv1",
    "rxjs": "rxjs_APIv6",
    "@youwol/fv-button": "@youwol/fv-button_APIv01",
    "@youwol/fv-code-mirror-editors": "@youwol/fv-code-mirror-editors_APIv01",
    "@youwol/fv-group": "@youwol/fv-group_APIv02",
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv6",
            "operators"
        ]
    }
}
export const setup = {
    name:'@youwol/installers-flux',
    assetId:'QHlvdXdvbC9pbnN0YWxsZXJzLWZsdXg=',
    version:'0.1.0',
    shortDescription:"Collections of installers related to the flux application of YouWol",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/installers-flux',
    npmPackage:'https://www.npmjs.com/package/@youwol/installers-flux',
    sourceGithub:'https://github.com/youwol/installers-flux',
    userGuide:'https://l.youwol.com/doc/@youwol/installers-flux',
    apiVersion:'01',
    runTimeDependencies,
    externals
}
