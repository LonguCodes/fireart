import { Result, Unit } from 'typescript-functional-extensions';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

function getErrorByCode(code: number) {
  switch (code) {
    case 400:
      return BadRequestException;
    case 401:
      return UnauthorizedException;
    case 403:
      return ForbiddenException;
    case 404:
      return NotFoundException;
    case 409:
      return ConflictException;
    case 500:
      return InternalServerErrorException;
  }
  return InternalServerErrorException;
}

export function handleResult<T>(result: Result<T, string>) {
  if (result.isFailure) {
    const [errorCode, ...errorMessageParts] = result
      .getErrorOrThrow()
      .split(':');

    const errorMessage = errorMessageParts.join(':');
    const errorType = getErrorByCode(parseInt(errorCode));

    throw new errorType(errorMessage);
  }

  const value = result.getValueOrThrow();

  if (value === Unit.Instance) {
    return;
  }

  return value;
}

export function mapData<T>(data: T): unknown {
  return data;
}
