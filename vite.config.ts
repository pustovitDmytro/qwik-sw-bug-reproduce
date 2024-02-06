import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgx from '@svgx/vite-plugin-qwik';
import { version } from './package.json';

export default defineConfig(() => {
    return {
        plugins : [
            svgx(),
            qwikCity(),
            qwikVite(),
            tsconfigPaths(),
        ],
        dev : {
            headers : {
                'Cache-Control' : 'public, max-age=0'
            }
        },
        preview : {
            headers : {
                'Cache-Control' : 'public, max-age=600'
            }
        },
        define : {
            TASTORIA_BUILD : {
                DATE    : new Date().toISOString(),
                VERSION : version
            }
        }
    };
});
