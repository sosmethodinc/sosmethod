import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {DiscoverySeriesComponent} from './discovery/discovery-series';
import {DiscoverySubtextComponent} from './discovery/discovery-subtext';
import {MeditationsComponent} from './meditation/meditations';
import {MeditateComponent} from './meditate/meditate';
import {MeditationsSubtextComponent} from './meditation/meditations-subtext';
import {PlayerComponent} from './player';
import {PlayerControlsComponent} from './player-controls';
import {COMMON_MODULES} from '../shared/common.module';
import {routing} from "./player.routing";

export const COMPONENTS = [
    PlayerComponent,
    PlayerControlsComponent,

    DiscoverySeriesComponent,
    DiscoverySubtextComponent,
    MeditateComponent,
    MeditationsComponent,
    MeditationsSubtextComponent
];


@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class PlayerModule {
}


