export const pagesData = [
  {
    title: "First Scene",
    url: "/firstScene/",
  },
  {
    title: "Shader Model",
    url: "/shaderModel/",
  },
  {
    title: "Sphere and Shadow",
    url: "/sphereAndShadow/",
  },
  {
    title: "Shader Wave",
    url: "/shaderWave/",
  },
  {
    title: "Shader Wave 2",
    url: "/shaderWave2/",
  },
  {
    title: "Shader Smoke",
    url: "/shaderSmoke/",
  },
  {
    title: "Noise Shader Wave",
    url: "/noiseShaderWave/",
  },
  {
    title: "Distortion Scroll",
    url: "/distortionScroll/",
  },
  {
    title: "Wire Sphere",
    url: "/wireSphere/",
  },
  {
    title: "Texture Earth",
    url: "/textureEarth/",
  },
  {
    title: "WIP）Shader Earth",
    url: "/shaderEarth/",
  },
  {
    title: "Halftone Shade",
    url: "/halftoneShade/",
  },
  {
    title: "Particles Basic",
    url: "/particlesBasic/",
  },
  {
    title: "Particles Galaxy",
    url: "/particlesGalaxy/",
  },
  {
    title: "Particles Galaxy Shader",
    url: "/particlesGalaxyShader/",
  },
  {
    title: "Particles Fireworks",
    url: "/particlesFireworks/",
  },
  {
    title: "Shader Lighting",
    url: "/shaderLighting/",
  },
  {
    title: "Shadow Test",
    url: "/shadowTest/",
  },
  {
    title: "Physics Basic",
    url: "/physicsBasic/",
  },
  {
    title: "Motion Hover Effect",
    url: "/motionHoverEffect/",
  },
  {
    title: "wind image",
    url: "/windImage/",
  },
  {
    title: "clone meshes",
    url: "/cloneMeshes/",
  },
];

interface PageData {
  url: string;
  title: string;
}

export const getPageTitle = function getPageTitle(
  data: PageData[],
  currentPathName: string,
): string {
  const page = data.find((d: PageData) => d.url === currentPathName);
  return page ? page.title : "";
};
