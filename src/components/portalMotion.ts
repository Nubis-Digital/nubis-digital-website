export interface PortalMotionEnvironment {
  viewportWidth: number
  reducedMotion: boolean
}

export function shouldEnablePortalMotion({
  viewportWidth,
  reducedMotion,
}: PortalMotionEnvironment): boolean {
  return viewportWidth >= 900 && !reducedMotion
}
