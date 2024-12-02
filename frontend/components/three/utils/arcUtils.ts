// Credited to GhostCatcg
// https://github.com/GhostCatcg/3d-earth?tab=MIT-1-ov-file
import {
  Vector3,
  Quaternion,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  ArcCurve,
  Color,
  Points,
  PointsMaterial,
  BufferAttribute,
  Clock,
  AdditiveBlending,
} from "three";

/**
 * Convert longitude and latitude to 3D coordinates
 * @param radius Sphere radius
 * @param longitude Longitude in degrees
 * @param latitude Latitude in degrees
 * @returns Vector3 position
 */
export function lon2xyz(
  radius: number,
  longitude: number,
  latitude: number
): Vector3 {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = -(longitude + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}

/**
 * Calculate angle between two points and a center point
 */
function radianAOB(A: Vector3, B: Vector3, O: Vector3): number {
  const dir1 = A.clone().sub(O).normalize();
  const dir2 = B.clone().sub(O).normalize();
  const cosAngle = dir1.clone().dot(dir2);
  return Math.acos(cosAngle);
}

/**
 * Calculate center of circle passing through three points
 */
function threePointCenter(p1: Vector3, p2: Vector3, p3: Vector3): Vector3 {
  const L1 = p1.lengthSq();
  const L2 = p2.lengthSq();
  const L3 = p3.lengthSq();
  const x1 = p1.x,
    y1 = p1.y;
  const x2 = p2.x,
    y2 = p2.y;
  const x3 = p3.x,
    y3 = p3.y;

  const S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
  const x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2;
  const y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2;

  return new Vector3(x, y, 0);
}

/**
 * Create a flying line with gradient effect
 */
function createFlyLine(
  radius: number,
  startAngle: number,
  endAngle: number,
  color: number
): Points {
  const geometry = new BufferGeometry();
  const arc = new ArcCurve(0, 0, radius, startAngle, endAngle, false);
  const pointsArr = arc.getSpacedPoints(120);
  geometry.setFromPoints(pointsArr);

  const percentArr = pointsArr.map((_, i) => i / pointsArr.length);
  geometry.setAttribute(
    "percent",
    new BufferAttribute(new Float32Array(percentArr), 1)
  );

  const colorArr: number[] = [];
  for (let i = 0; i < pointsArr.length; i++) {
    const color1 = new Color(0xec8f43);
    const color2 = new Color(0xf3ae76);
    const colorMix = color1.lerp(color2, i / pointsArr.length);
    colorArr.push(colorMix.r, colorMix.g, colorMix.b);
  }
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colorArr), 3)
  );

  const material = new PointsMaterial({
    size: 0.02,
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    opacity: 1.0,
    blending: AdditiveBlending,
  });

  material.onBeforeCompile = function (shader) {
    shader.uniforms.time = { value: 0 };

    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      [
        "uniform float time;",
        "attribute float percent;",
        "varying float vPercent;",
        "varying float vOpacity;",
        "void main() {",
        "  vPercent = percent;",
        "  vOpacity = smoothstep(0.0, 0.2, percent) * smoothstep(1.0, 0.8, percent);",
      ].join("\n")
    );

    shader.vertexShader = shader.vertexShader.replace(
      "gl_PointSize = size;",
      ["gl_PointSize = percent * size;"].join("\n")
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      [
        "varying float vPercent;",
        "varying float vOpacity;",
        "void main() {",
      ].join("\n")
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      ["gl_FragColor = vec4(outgoingLight, diffuseColor.a * vOpacity);"].join(
        "\n"
      )
    );

    // Store shader reference
    material.userData.shader = shader;
  };

  const FlyLine = new Points(geometry, material);
  material.color = new Color(color);
  FlyLine.name = "flyLine";

  // Add update function for animation
  const clock = new Clock();
  FlyLine.userData.update = function () {
    if (material.userData.shader) {
      material.userData.shader.uniforms.time.value = clock.getElapsedTime();
    }
  };

  return FlyLine;
}

/**
 * Project 3D points onto 2D plane for arc calculation
 */
function _3Dto2D(startSphere: Vector3, endSphere: Vector3) {
  const origin = new Vector3(0, 0, 0);
  const startDir = startSphere.clone().sub(origin).normalize();
  const endDir = endSphere.clone().sub(origin).normalize();

  const normal = startDir.clone().cross(endDir).normalize();
  const xoyNormal = new Vector3(0, 0, 1);

  const quaternion3D_XOY = new Quaternion().setFromUnitVectors(
    normal,
    xoyNormal
  );
  const startSphereXOY = startSphere.clone().applyQuaternion(quaternion3D_XOY);
  const endSphereXOY = endSphere.clone().applyQuaternion(quaternion3D_XOY);

  const middleV3 = startSphereXOY.clone().add(endSphereXOY).multiplyScalar(0.5);
  const midDir = middleV3.clone().sub(origin).normalize();
  const yDir = new Vector3(0, 1, 0);

  const quaternionXOY_Y = new Quaternion().setFromUnitVectors(midDir, yDir);
  const startSpherXOY_Y = startSphereXOY
    .clone()
    .applyQuaternion(quaternionXOY_Y);
  const endSphereXOY_Y = endSphereXOY.clone().applyQuaternion(quaternionXOY_Y);

  const quaternionInverse = quaternion3D_XOY
    .clone()
    .invert()
    .multiply(quaternionXOY_Y.clone().invert());

  return {
    quaternion: quaternionInverse,
    startPoint: startSpherXOY_Y,
    endPoint: endSphereXOY_Y,
  };
}

/**
 * Create arc in XOY plane
 */
function arcXOY(
  radius: number,
  startPoint: Vector3,
  endPoint: Vector3,
  options: { color?: number; flyLineColor?: number }
) {
  const middleV3 = new Vector3()
    .addVectors(startPoint, endPoint)
    .multiplyScalar(0.5);
  const dir = middleV3.clone().normalize();
  const earthRadianAngle = radianAOB(
    startPoint,
    endPoint,
    new Vector3(0, 0, 0)
  );
  const arcTopCoord = dir.multiplyScalar(
    radius + earthRadianAngle * radius * 0.2
  );

  const flyArcCenter = threePointCenter(startPoint, endPoint, arcTopCoord);
  const flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y);

  const flyRadianAngle = radianAOB(
    startPoint,
    new Vector3(0, -1, 0),
    flyArcCenter
  );
  const startAngle = -Math.PI / 2 + flyRadianAngle;
  const endAngle = Math.PI - startAngle;

  const geometry = new BufferGeometry();
  const arc = new ArcCurve(
    flyArcCenter.x,
    flyArcCenter.y,
    flyArcR,
    startAngle,
    endAngle,
    false
  );
  const points = arc.getSpacedPoints(80);
  geometry.setFromPoints(points);

  const material = new LineBasicMaterial({
    color: options.color || 0xd18547,
  });

  const arcline = new Line(geometry, material);
  arcline.userData["center"] = flyArcCenter;
  arcline.userData["topCoord"] = arcTopCoord;

  // Adjust the flying line segment length and animation
  const flyAngle = (endAngle - startAngle) / 7; // Reduced from /7 to make segment longer
  const flyLine = createFlyLine(
    flyArcR,
    startAngle,
    startAngle + flyAngle,
    options.flyLineColor || 0xec8f43
  );
  flyLine.position.y = flyArcCenter.y;
  arcline.add(flyLine);

  // Set the full range for animation
  flyLine.userData["flyEndAngle"] = endAngle - startAngle; // Remove the - flyAngle to allow full range
  flyLine.userData["startAngle"] = startAngle;
  flyLine.userData["AngleZ"] = 0; // Start from beginning

  arcline.userData["flyLine"] = flyLine;

  return arcline;
}

/**
 * Create flying arc between two geographic coordinates
 */
export function flyArc(
  radius: number,
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
  options: { color?: number; flyLineColor?: number }
) {
  const startSphereCoord = lon2xyz(radius, lon1, lat1);
  const endSphereCoord = lon2xyz(radius, lon2, lat2);

  const startEndQua = _3Dto2D(startSphereCoord, endSphereCoord);
  const arcline = arcXOY(
    radius,
    startEndQua.startPoint,
    startEndQua.endPoint,
    options
  );
  arcline.quaternion.multiply(startEndQua.quaternion);

  return arcline;
}

/**
 * Calculate arc point
 */
export function calculateArcPoint(
  startPoint: Vector3,
  endPoint: Vector3,
  arcHeightFactor: number = 0.2
): Vector3 {
  // Calculate midpoint
  const midPoint = new Vector3()
    .addVectors(startPoint, endPoint)
    .multiplyScalar(0.5);

  // Calculate angle between points
  const angle = startPoint.angleTo(endPoint);

  // Calculate arc height based on the angle between points
  const baseHeight = 2.4; // Base height above Earth's surface (15%)
  const dynamicHeight = arcHeightFactor * (angle / Math.PI); // Additional height based on distance
  const arcHeight = baseHeight + dynamicHeight;

  // Normalize and set the height of the midpoint
  return midPoint.normalize().multiplyScalar(arcHeight);
}
