import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

await pusher.init({
  apiKey: "a88dae1c4db6bd02ffbc",
  cluster: "eu"
});

await pusher.connect();
await pusher.subscribe({
  channelName: "my-channel",
  onEvent: (event: PusherEvent) => {
    console.log(`Event received: ${event}`);
  }
});
