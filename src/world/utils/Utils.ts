import { Vector2, Vector3, Vector4, Quaternion } from "@babylonjs/core";
import { IWSVector3, IWSVector4 } from "../shared/worldserver.type";

export function moveTowardsScalar(
  current: number,
  target: number,
  maxDistanceDelta: number
): number {
  const toValue: number = target - current;
  if (
    toValue === 0 ||
    (maxDistanceDelta >= 0 && Math.abs(toValue) <= maxDistanceDelta)
  ) {
    return target;
  } else {
    const sign = Math.sign(toValue);
    const newValue = current + sign * maxDistanceDelta;
    return newValue;
  }
}

export function moveTowardsVector2(
  current: Vector2,
  target: Vector2,
  maxDistanceDelta: number
): Vector2 {
  const result: Vector2 = new Vector2(0.0, 0.0);
  moveTowardsVector2ToRef(current, target, maxDistanceDelta, result);
  return result;
}
export function moveTowardsVector2ToRef(
  current: Vector2,
  target: Vector2,
  maxDistanceDelta: number,
  result: Vector2
): void {
  const toVector_x: number = target.x - current.x;
  const toVector_y: number = target.y - current.y;
  const sqDist: number = toVector_x * toVector_x + toVector_y * toVector_y;
  if (
    sqDist == 0 ||
    (maxDistanceDelta >= 0 && sqDist <= maxDistanceDelta * maxDistanceDelta)
  ) {
    result.set(target.x, target.y);
  } else {
    const dist: number = Math.sqrt(sqDist);
    result.set(
      current.x + (toVector_x / dist) * maxDistanceDelta,
      current.y + (toVector_y / dist) * maxDistanceDelta
    );
  }
}

export function moveTowardsVector3(
  current: Vector3,
  target: Vector3,
  maxDistanceDelta: number
): Vector3 {
  const result: Vector3 = new Vector3(0.0, 0.0, 0.0);
  moveTowardsVector3ToRef(current, target, maxDistanceDelta, result);
  return result;
}
export function moveTowardsVector3ToRef(
  current: Vector3,
  target: Vector3,
  maxDistanceDelta: number,
  result: Vector3
): void {
  const toVector_x: number = target.x - current.x;
  const toVector_y: number = target.y - current.y;
  const toVector_z: number = target.z - current.z;
  const sqDist: number =
    toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;
  if (
    sqDist == 0 ||
    (maxDistanceDelta >= 0 && sqDist <= maxDistanceDelta * maxDistanceDelta)
  ) {
    result.set(target.x, target.y, target.z);
  } else {
    const dist: number = Math.sqrt(sqDist);
    result.set(
      current.x + (toVector_x / dist) * maxDistanceDelta,
      current.y + (toVector_y / dist) * maxDistanceDelta,
      current.z + (toVector_z / dist) * maxDistanceDelta
    );
  }
}

export function moveTowardsVector4(
  current: Vector4,
  target: Vector4,
  maxDistanceDelta: number
): Vector4 {
  const result: Vector4 = new Vector4(0.0, 0.0, 0.0, 0.0);
  moveTowardsVector4ToRef(current, target, maxDistanceDelta, result);
  return result;
}
export function moveTowardsVector4ToRef(
  current: Vector4,
  target: Vector4,
  maxDistanceDelta: number,
  result: Vector4
): void {
  const toVector_x: number = target.x - current.x;
  const toVector_y: number = target.y - current.y;
  const toVector_z: number = target.z - current.z;
  const toVector_w: number = target.w - current.w;
  const sqDist: number =
    toVector_x * toVector_x +
    toVector_y * toVector_y +
    toVector_z * toVector_z +
    toVector_w * toVector_w;
  if (
    sqDist == 0 ||
    (maxDistanceDelta >= 0 && sqDist <= maxDistanceDelta * maxDistanceDelta)
  ) {
    result.set(target.x, target.y, target.z, target.w);
  } else {
    const dist: number = Math.sqrt(sqDist);
    result.set(
      current.x + (toVector_x / dist) * maxDistanceDelta,
      current.y + (toVector_y / dist) * maxDistanceDelta,
      current.z + (toVector_z / dist) * maxDistanceDelta,
      current.w + (toVector_w / dist) * maxDistanceDelta
    );
  }
}

export function moveTowardsQuaternion(
  current: Quaternion,
  target: Quaternion,
  maxDistanceDelta: number
): Quaternion {
  const result: Quaternion = new Quaternion();
  moveTowardsQuaternionToRef(current, target, maxDistanceDelta, result);
  return result;
}

export function moveTowardsQuaternionToRef(
  current: Quaternion,
  target: Quaternion,
  maxDistanceDelta: number,
  result: Quaternion
): void {
  const dot: number = Quaternion.Dot(current, target);

  if (dot > 0.99999) {
    Quaternion.SlerpToRef(current, target, maxDistanceDelta, result);
    result.normalize();
  } else {
    Quaternion.SlerpToRef(current, target, maxDistanceDelta, result);
  }
}

export const toBabylonVector3 = (v: IWSVector3): Vector3 =>
  new Vector3(v.x, v.y, v.z);

export const fromBabylonVector3 = (v: Vector3): IWSVector3 => ({
  x: v.x,
  y: v.y,
  z: v.z,
});

export const toBabylonQuaternion = (q: IWSVector4): Quaternion =>
  new Quaternion(q.x, q.y, q.z, q.w);

export const fromBabylonQuaternion = (q: Quaternion): IWSVector4 => ({
  x: q.x,
  y: q.y,
  z: q.z,
  w: q.w,
});
