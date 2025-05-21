import { FactoryProvider } from '@nestjs/common';

export type ModuleConfigFactory<T> = Pick<
  FactoryProvider<T>,
  'inject' | 'useFactory'
> & {
  global?: boolean;
};
