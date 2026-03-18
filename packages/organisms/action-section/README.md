# ActionSection

`ActionSection` is a generic organism for grouping structured action surfaces such as `ActionCard`.

## Use It For

- grouped action queues
- review lists
- request/approval-style sections
- any section that needs a title, optional count, optional header action, and a consistent card stack

## Do Not Use It For

- page-level routing or filtering logic
- fetching or orchestration
- business-specific workflow state

## API

- `title`
- `count`
- `headerAction`
- `children`

## Notes

- layout and spacing come from the theme/token layer
- responsive header behavior uses container queries
- the component stays generic; example business content belongs in stories and consuming apps
