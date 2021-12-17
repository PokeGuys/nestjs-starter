import { DEFAULT_CLIENT_NAME } from '@libraries/firebase-admin/firebase-admin.constants';
import { FirebaseAdminModuleOptions } from '@libraries/firebase-admin/interfaces';
import { initializeApp } from 'firebase-admin';

export function getClientToken(name: string = DEFAULT_CLIENT_NAME): string {
  return name && name !== DEFAULT_CLIENT_NAME ? `${name}Connection` : DEFAULT_CLIENT_NAME;
}

export function createClient(options: FirebaseAdminModuleOptions) {
  return initializeApp(options, options.name);
}
