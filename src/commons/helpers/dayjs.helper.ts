import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const dateNow = (): Date => {
  return dayjs().toDate();
};

export const dateIsSameOrAfter = (compareDate: Date, date: Date): boolean => {
  compareDate = compareDate ?? new Date();
  return dayjs(compareDate).isSame(date) || dayjs(compareDate).isAfter(date);
};

export const dateIsSameOrBefore = (compareDate: Date, date: Date): boolean => {
  compareDate = compareDate ?? new Date();
  return dayjs(compareDate).isSame(date) || dayjs(compareDate).isBefore(date);
};

export const dateIsBefore = (compareDate: Date, date: Date): boolean => {
  compareDate = compareDate ?? new Date();
  return dayjs(compareDate).isBefore(date);
};

export const dateIsAfter = (compareDate: Date, date: Date): boolean => {
  compareDate = compareDate ?? new Date();
  return dayjs(compareDate).isAfter(date);
};

export const dateAdd = (
  compareDate: Date,
  value: number,
  unit: dayjs.ManipulateType,
): Date => {
  return dayjs(compareDate ?? new Date())
    .add(value, unit)
    .toDate();
};

export const dateSubtract = (
  compareDate: Date,
  value: number,
  unit: dayjs.ManipulateType,
): Date => {
  return dayjs(compareDate ?? new Date())
    .subtract(value, unit)
    .toDate();
};

export const unixToDate = (unixTimestamp: number): Date => {
  return dayjs.unix(unixTimestamp).toDate();
};

export const dateDiff = (
  compareDate: Date,
  value: Date,
  unit: dayjs.ManipulateType,
): number => {
  return dayjs(compareDate ?? new Date()).diff(value, unit);
};

export const rangeDateBetween = async (
  min: Date,
  max: Date,
  amountArray: number,
): Promise<Date[]> => {
  const result = [];
  if (dayjs(max).isBefore(min)) {
    return [];
  }
  const diffMinMax = dayjs(max).diff(min, 'millisecond');
  const periodTimePerDate = Math.floor(diffMinMax / amountArray);
  for (let i = 0; i < amountArray; i++) {
    const addMill = Math.floor(periodTimePerDate * i * (1 + Math.random()));
    let val = dayjs(min).add(addMill, 'millisecond').toDate();
    if (dayjs(val).isAfter(max)) {
      val = max;
    }
    result.push(val);
  }
  await Promise.all(result);
  return result;
};

export function roundTimeToNearestMinute(time: Date = new Date()): Date {
  const roundingIncrement = 1;
  const now = dayjs(time);

  const seconds = now.second();
  const roundedSeconds =
    Math.round(seconds / roundingIncrement) * roundingIncrement;

  if (roundedSeconds >= 60) {
    // If rounding goes beyond 59, add a minute and reset seconds to 0
    return now.add(1, 'minute').millisecond(0).toDate();
  } else {
    // Otherwise, set seconds to the rounded value and milliseconds to 0
    return now.second(roundedSeconds).millisecond(0).toDate();
  }
}

export function roundTimeToNearestFiveMinutes(time: Date = new Date()): Date {
  const roundingIncrement = 5;
  const now = dayjs(time);

  const minutes = now.minute();
  const roundedMinutes =
    Math.round(minutes / roundingIncrement) * roundingIncrement;

  if (roundedMinutes >= 60) {
    // If rounding goes beyond 59, add an hour and reset minutes to 0
    return now.add(1, 'hour').minute(0).second(0).millisecond(0).toDate();
  } else {
    // Otherwise, set minutes to the rounded value and reset seconds and milliseconds to 0
    return now.minute(roundedMinutes).second(0).millisecond(0).toDate();
  }
}
