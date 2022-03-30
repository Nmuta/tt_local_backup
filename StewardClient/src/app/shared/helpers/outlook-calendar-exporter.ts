/** Converts date into properly formated time string for Outlook consumption. */
export function buildOutlookTimeString(date: Date): string {
  return `${date.getHours() % 12}:${date.getMinutes()}:${date.getSeconds()} ${
    date.getHours() / 12 < 1 ? 'AM' : 'PM'
  }`;
}

/** Converts date into properly formated date string for Outlook consumption. */
export function buildOutlookDateString(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

/** Returns an array of the required Outlook calendar headers. */
export function getOutlookCalendarHeaders(): string[] {
  return [
    '"Subject"',
    '"Start Date"',
    '"Start Time"',
    '"End Date"',
    '"End Time"',
    '"All day event"',
    '"Reminder on/off"',
    '"Reminder Date"',
    '"Reminder Time"',
    '"Meeting Organizer"',
    '"Required Attendees"',
    '"Optional Attendees"',
    '"Meeting Resources"',
    '"Billing Information"',
    '"Categories"',
    '"Description"',
    '"Location"',
    '"Mileage"',
    '"Priority"',
    '"Private"',
    '"Sensitivity"',
    '"Show time as"',
  ];
}
