import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import 'stream-browserify';
import 'timers-browserify';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
