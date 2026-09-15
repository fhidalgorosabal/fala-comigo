import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Conversation } from './features/conversation/conversation';

@Component({
  selector: 'app-root',
  imports: [Conversation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-conversation />',
})
export class App {}
