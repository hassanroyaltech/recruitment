import React, { Component } from 'react';
import VideoPlayer from 'react-video-js-player';

class VideoCard extends Component {
  player = {};

  state = {
    video: {
      src: this.props.src,
      poster: this.props.poster,
    },
  };

  onPlayerReady(player) {
    this.player = player;
  }

  onVideoPlay(duration) {
    console.log('Video played at: ', duration);
  }

  onVideoPause(duration) {
    console.log('Video paused at: ', duration);
  }

  onVideoTimeUpdate(duration) {
    console.log('Time updated: ', duration);
  }

  onVideoSeeking(duration) {
    console.log('Video seeking: ', duration);
  }

  onVideoSeeked(from, to) {
    console.log(`Video seeked from ${from} to ${to}`);
  }

  onVideoEnd() {
    console.log('Video ended');
  }

  render() {
    return (
      <div className={`card m-0 dz-video ${this.props.className}`}>
        <div>
          <VideoPlayer
            className={` dz-preview-video w-100 ${this.props.className}`}
            controls
            src={this.state.video.src}
            poster={this.state.video.poster}
            width={this.props.width}
            style={this.props.style}
            height={this.props.height ? this.props.height : '186'}
            onReady={this.onPlayerReady.bind(this)}
            onPlay={this.onVideoPlay.bind(this)}
            onPause={this.onVideoPause.bind(this)}
            onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
            onSeeking={this.onVideoSeeking.bind(this)}
            onSeeked={this.onVideoSeeked.bind(this)}
            onEnd={this.onVideoEnd.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default VideoCard;
