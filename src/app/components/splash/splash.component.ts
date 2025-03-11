import { Component } from '@angular/core';

@Component({
  selector: 'app-splash',
  template: `
    <div class="splash">
      <h3>Welcome to Stan's Robot Shop</h3>
      <p>Here you will find all of Stan's friends. Have a browse around and see who is here.</p>
      <p>
        This is a simple example microservices ecommerce application.
        It has been built using various technologies:
      </p>
      <ul>
        <li>Angular</li>
        <li>Nginx</li>
        <li>NodeJS</li>
        <li>Java</li>
        <li>Python</li>
        <li>Golang</li>
        <li>PHP (Apache)</li>
        <li>MongoDB</li>
        <li>Redis</li>
        <li>MySQL</li>
      </ul>
      <p>
        When deployed into an environment monitored by Instana, these technology stacks will be automatically
        detected and monitored, all with minimum configuration. Every request will be traced end to end.
        Stan will keep an eye on all those metrics, events and traces and let you know what needs your attention.
      </p>
      <p>
        To find out more visit the <a href="https://instana.com/" target="_blank" class="cont">Instana</a> site.
      </p>
      <p>
        All the code is available on <a href="https://github.com/instana/robot-shop" target="_blank" class="cont">Github</a>.
      </p>
    </div>
  `,
  styles: [`
    .splash {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-image: url("/media/graph.png");
      background-repeat: no-repeat;
      background-position: right top;
    }
    h3 {
      font-family: 'Orbitron', sans-serif;
      margin-bottom: 20px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin: 10px 0;
    }
    .cont {
      font-weight: bold;
    }
  `]
})
export class SplashComponent {}