uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;


void main()
{
    float strength = clamp(distance(vUv, vec2(0.5))+sin(uTime), 0.0, 1.0);

    vec3 color = mix(uColorStart, uColorEnd, strength);

    gl_FragColor = vec4(color, 1.0);
}