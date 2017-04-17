/**
 * @class
 * @description
 * Wrapper for HTML5 audio.
 */
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {Injectable, NgZone} from '@angular/core';
import {Subject} from "rxjs/Subject";

declare var AudioContext: any;
declare var webkitAudioContext: any;

@Injectable()
export class AudioService {
    public playerPositions: Subject<number> = new Subject();
    public position: Subject<number> = new Subject();
    public nextUp: string;
    public AWS = 'https://s3-us-west-2.amazonaws.com/sosmethod/';

    public timeupdate: Observable<string> = this.BindAudioEvent('timeupdate');
    public metadata: Observable<string> = this.BindAudioEvent('loadedmetadata');
    public ended: Observable<string> = this.BindAudioEvent('ended');
    public progress: Observable<string> = this.BindAudioEvent('progress');
    public abort: Observable<string> = this.BindAudioEvent('abort');
    public play: Observable<string> = this.BindAudioEvent('play');
    public pause: Observable<string> = this.BindAudioEvent('pause');
    public stalled: Observable<string> = this.BindAudioEvent('stalled');
    public waiting: Observable<string> = this.BindAudioEvent('waiting');
    public playing: Observable<string> = this.BindAudioEvent('playing');
    public seeking: Observable<string> = this.BindAudioEvent('seeking');
    public seeked: Observable<string> = this.BindAudioEvent('seeked');
    public emptied: Observable<string> = this.BindAudioEvent('emptied');

    public state: Subject<string> = new Subject();

    _src: string;
    _audio: any;
    _audioSrc: any;
    _analyser: any;
    _audioCtx = new (AudioContext || webkitAudioContext)();
    _svg: any;
    public duration: number;
    public currentTime: number;

    constructor(private _zone: NgZone) {
        this._createAudio();
    }

    Play() {
        this.Load(this.nextUp);
        this._audio.play(); // then play
        // Comment visuliziation out for now.
        // this.Visualize();
    }

    Pause() {
        this._audio.pause();
    }

    Stop() {
        this._audio.pause();
    }

    Load(url: string) {
        if (!this._audio || url !== this._src) {
            this._createAudio();
            this._audio.pause();
            this._audio.src = this._src = url;
            this._audio.load();
        }
    }

    SetTimePercent(percent: number) {
        if (typeof this._audio.seekable === 'object' && this._audio.seekable.length > 0) {
            this._audio.currentTime = percent * this._audio.seekable.end(this._audio.seekable.length - 1) / 100;
        } else if (this._audio.duration > 0 && !isNaN(this._audio.duration)) {
            this._audio.currentTime = percent * this._audio.duration / 100;
        }
    }

    AttachEvents() {
        this.ended.subscribe(() => this.state.next('ended'));
        this.abort.subscribe(() => this.state.next('abort'));
        this.play.subscribe(() => this.state.next('play'));
        this.pause.subscribe(() => this.state.next('pause'));
        this.stalled.subscribe(() => this.state.next('stalled'));
        this.waiting.subscribe(() => this.state.next('waiting'));
        this.playing.subscribe(() => this.state.next('playing'));
        this.seeking.subscribe(() => this.state.next('seeking'));
        this.seeked.subscribe(() => this.state.next('seeked'));
        this.emptied.subscribe(() => this.state.next('emptied'));
        this.state.subscribe((s) => console.log(s));
        this.state.subscribe((data) => {
            this.duration = this._audio.duration;
        });
        this.timeupdate.subscribe(() => {
            this.currentTime = this._audio.currentTime;
        });
    }

    BindAudioEvent<E>(eventName: string): Observable<E> {
        const self = this;
        return Observable.create((observer: Observer<E>) => {
            self._audio.addEventListener(eventName, (args: E) => {
                self._zone.run(() => observer.next(args));
            });
        });
    }

    _createAudio(): void {
        if (!this._audio) {
            this._audio = new Audio();
            this._audio.autoplay = false;
            this._audio.preload = 'auto';
            this._audio.autobuffer = true;
            this.AttachEvents();
        }

        if (!this._audioSrc) {
            this._audioSrc = this._audioCtx.createMediaElementSource(this._audio);
        }

        if (!this._analyser && this._audioSrc.connect) {
            // Bind our analyser to the media element source.
            // TODO: add wave surfer
            //this._analyser = this._audioCtx.createAnalyser();
            //this._audioSrc.connect( this._analyser );
            //this._audioSrc.connect( this._audioCtx.destination );
        }
    }

    _destroyAudio(): void {
        if (this._audio) {
            this._audio.pause();
            this._audio.unbindEvents();
            try {
                this._audio.src = '';
            } finally {
                delete this._audio;
            }
        }
    }

}
