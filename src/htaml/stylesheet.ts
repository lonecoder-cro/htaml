const htamlFade = () => {
    return `

.htaml-cloak{
    opacity:0 !important;
    pointer-events:none;
}

.htaml-show{
    opacity:1 !important;
    pointer-events:all;
}

.htaml-none{
    display:none !important;
    pointer-events:none;
}

.htaml-block{
    display:block !important;
    pointer-events:all;
}

.htaml-hidden{
    visibility: hidden !important;
    pointer-events:none;
}

.htaml-visible{
    visibility: visible !important;
    pointer-events:all;
}

.htaml-fadein {
    visibility: hidden !important;
    opacity:0;
}

.htaml-fadein-active
{
    visibility: visible !important;

    -webkit-animation: fadeInFromNone 0.5s ease-out;
    -moz-animation: fadeInFromNone 0.5s ease-out;
    -o-animation: fadeInFromNone 0.5s ease-out;
    animation: fadeInFromNone 0.5s ease-out;
}

@-webkit-keyframes fadeInFromNone {
    0% {
        display: none !important;
        opacity: 0;
    }

    1% {
        display: block !important;
        opacity: 0;
    }

    25% {
        display: block !important;
        opacity: 0.3;
    }

    55% {
        display: block !important;
        opacity: 0.4;
    }

    80% {
        display: block !important;
        opacity: 0.6;
    }

    100% {
        display: block !important;
        opacity: 1;
    }
}
@-moz-keyframes fadeInFromNone {
    0% {
        display: none !important;
        opacity: 0;
    }

    1% {
        display: block !important;
        opacity: 0;
    }

    25% {
        display: block !important;
        opacity: 0.3;
    }

    55% {
        display: block !important;
        opacity: 0.4;
    }

    80% {
        display: block !important;
        opacity: 0.6;
    }

    100% {
        display: block !important;
        opacity: 1;
    }
}

@-o-keyframes fadeInFromNone {
    0% {
        display: none !important;
        opacity: 0;
    }

    1% {
        display: block !important;
        opacity: 0;
    }

    25% {
        display: block !important;
        opacity: 0.3;
    }

    55% {
        display: block !important;
        opacity: 0.4;
    }

    80% {
        display: block !important;
        opacity: 0.6;
    }

    100% {
        display: block !important;
        opacity: 1;
    }
}

@keyframes fadeInFromNone {
    0% {
        display: none !important;
        opacity: 0;
    }

    1% {
        display: block !important;
        opacity: 0;
    }

    25% {
        display: block !important;
        opacity: 0.3;
    }

    55% {
        display: block !important;
        opacity: 0.4;
    }

    80% {
        display: block !important;
        opacity: 0.6;
    }

    100% {
        display: block !important;
        opacity: 1;
    }
}
}
    `.trim()
}


export default [htamlFade]
