import { Buffer } from 'buffer';
import { jwt, isTokenValid } from '$lib/stores/session.store';

export function logout(): void {
  jwt.set('');
  isTokenValid.set(false);
  location.href = '/';
}

export function toAda(amount: number): number {
  return amount / 1000000;
}

export function dateFromUnix(unixTimestamp: number): Date {
  return new Date(unixTimestamp * 1000);
}

export function formatDate(date: Date): string {
  const dateStr = date.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = date.toLocaleTimeString();

  return `${dateStr} | ${timeStr}`;
}

export function createTimestamp(date: Date): string {
  const zeroLead = (str: number) => ('0' + str).slice(-2);

  return `${date.getFullYear()}-${zeroLead(date.getMonth() + 1)}-${zeroLead(
    date.getDate(),
  )} ${zeroLead(date.getHours())}:${zeroLead(date.getMinutes())}:${zeroLead(date.getSeconds())}`;
}

export function parseAssetHex(hex: string): { policy: string; name: string } {
  return {
    policy: hex.slice(0, 56),
    name: Buffer.from(hex.slice(56), 'hex').toString(),
  };
}

export function range(size: number, startAt = 0): number[] {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export function formatThousand(value: number, separator = ','): string {
  const split = value.toString().split('.');
  split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return split.join('.');
}
