import { Color, Vector2 } from "three";

export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR  = 1000;
export const CAMERA_FOV  = 34;


export const MATERIAL_PROPS = {
  roughness: .1,
}

export const GRADIENT_COLORS = [
  new Color( 0xF8421A ),
  new Color( 0xFF6A1A ),
]

export const GRADIENT_STEP = new Vector2(0.1, 0.9);

export const SATURATION = .75; // 0..1

export const ORBIT_DAMPING = .1;

export const INTERSECTION_THRESHOLD = .35;

export const ANIMATION_SPEED = .5;
