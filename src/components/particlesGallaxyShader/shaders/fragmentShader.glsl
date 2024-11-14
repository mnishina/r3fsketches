varying vec3 vColor;

void main() {

  // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

  // エッジの効いた円
  // float strength = distance(gl_PointCoord, vec2(0.5)); //0.5からのgl_PointCoord(全ピクセル)の距離を返す。
  // strength = 1.0 - step(0.5, strength); //全ピクセルに対して０から１を返す。１を引くことで１から０を返す順序に変える。
  // gl_FragColor = vec4(vec3(strength), 1.0);

  //縁がふわっとした円
  // float strength = distance(gl_PointCoord, vec2(0.5)); //0.5からのgl_PointCoord(全ピクセル)の距離を返す。
  // strength *= 2.0; //2倍にすることでエッジを強調する。
  // strength = 1.0 - strength; //1を引くことで0から1に変える。縁がふわっとした円にする
  
  // 色を付与
  float strength = distance(gl_PointCoord, vec2(0.5)); //0.5からのgl_PointCoord(全ピクセル)の距離を返す。
  strength = 1.0 - strength; //1を引くことで0から1に変える。縁がふわっとした円にする
  strength = pow(strength, 10.0); //powで強度を10倍にする。

  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);



  #include <colorspace_fragment>
}
