import { IStepOption } from 'ngx-ui-tour-md-menu';

// TODO: implement markdown rendering when marked is fixed

/** Contains the step settings and information to run the Home tour */
export const homeTourSteps: IStepOption[] = [
  {
    anchorId: 'shared-tour.centered',
    content:
      'Welcome to <b>Steward</b>!<br /><br />This brief tour will help familiarize you with some of the basic functions of the app.',
  },
  {
    anchorId: 'home-tour.step.two',
    content: 'Click on the <b>Settings</b> icon to adjust options such as endpoints and theming.',
    enableBackdrop: true,
  },
  {
    anchorId: 'home-tour.step.three',
    content:
      'Be sure to read through the <b>Active Changelog</b> and check the boxes so you can stay up to date on new changes!',
    enableBackdrop: true,
  },
  {
    anchorId: 'home-tour.step.four',
    content:
      'Each tile represents a <b>tool</b> that is available for you to use.<br /><br />The number of available tools may differ depending on the permissions associated with your account.',
    enableBackdrop: true,
    disablePageScrolling: true,
    disableScrollToAnchor: true,
  },
  {
    anchorId: 'home-tour.step.five',
    content:
      'Using the <b>In Nav</b> checkbox on the tool tile adds or removes the tool from the nav bar.',
    enableBackdrop: true,
  },
  {
    anchorId: 'home-tour.step.six',
    content:
      'The order of the tools in the nav bar can be rearranged if you click on the <b>Edit</b> icon.',
    enableBackdrop: true,
  },
  {
    anchorId: 'home-tour.step.seven',
    content:
      'While in <b>Edit Mode</b>, all the links to the tools on the nav bar appear as buttons, so you can drag and drop them in the order you prefer.',
    enableBackdrop: true,
  },
  {
    anchorId: 'home-tour.step.eight',
    content:
      'Use our <b>Contact Us</b> form if you need help, want to report a bug, or have a suggestion for a new feature.',
    enableBackdrop: true,
  },
  {
    anchorId: 'home-tour.step.nine',
    content:
      'Click here to view our <b>Documentation</b> at any time.<br /><br />Be sure to check out our <a href="https://confluence.turn10studios.com/x/r4GiE" target="_blank" class="shepherd-quick-start-guide-link"><b>Quick Start Guide</b></a> to learn more!',
    enableBackdrop: true,
  },
  {
    anchorId: 'shared-tour.centered',
    content: "Now that we've covered the basics, you're ready to get started!",
  },
];
