uniform vec3 uColor;
uniform vec3 uShadeColor;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying mat3 vNormalMatrix;

#include "../../Utils/shaders/ambientLight.glsl"
#include "../../Utils/shaders/directionalLight.glsl"
#include "../../Utils/shaders/pointLight.glsl"

vec3 halftone(
  vec3 color,
  float repetitions,
  vec3 direction,
  float low,
  float high,
  vec3 pointColor,
  vec3 normal
)
{
  float intensity = dot(normal, direction); // 法線とライトの方向の内積
  intensity = smoothstep(low, high, intensity);

  // マスのサイズを調整
  vec2 uv = gl_FragCoord.xy / uResolution.y; // yで割るとマスが正方形になる
  uv *= repetitions;
  uv = mod(uv, 1.0); // uv = fract(uv); fractでも同じっぽい
  
  float point = distance(uv, vec2(0.5));
  point = 1.0 - step(0.5 * intensity, point);
  
  return mix(color, pointColor, point);
}

void main() {

  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = uColor;

  // Light
  vec3 light = vec3(0.0);
  
  light += ambientLight(
    vec3(1.0),
    1.0
  );

  light += directionalLight(
    // vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower

    vec3(1.0),
    1.0,
    normal,
    vec3(1.0, 1.0, 0.0),
    viewDirection,
    1.0
  );

  color *= light;

  // Halftone
  color = halftone(
    color, // color
    50.0, // repetitions
    vec3(0.0, -1.0, 0.0), // direction
    -0.8, // low
    1.5, // high
    vec3(1.0, 0.0, 0.0), // pointColor
    normal // normal
  );

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
