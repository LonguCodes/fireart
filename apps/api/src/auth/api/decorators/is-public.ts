import { SetMetadata } from '@nestjs/common';

export const PUBLIC_METADATA = Symbol('public');

export function IsPublic() {
  return SetMetadata(PUBLIC_METADATA, true);
}
