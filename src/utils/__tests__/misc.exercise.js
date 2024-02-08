import {formatDate} from "../misc";

test('formatDate formats the date to look nice', () => {
    const received = formatDate(new Date('2011-10-10T14:48:00.000Z'))
    expect(received).toBe('Oct 11')
})
