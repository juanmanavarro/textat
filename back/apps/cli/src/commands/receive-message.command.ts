import { TransportService } from '@transport/transport';
import { Command, CommandRunner } from 'nest-commander';
import { DateService } from '@shared/services/date.service';

@Command({ name: 'receive', description: 'Receive message' })
export class ReceiveMessageCommand extends CommandRunner {
  constructor(
    private readonly transportService: TransportService,
  ) {
    super()
  }

  async run(): Promise<void> {
    const message = {
      _data: {
        id: {
          fromMe: false,
          remote: '34634566654@c.us',
          id: '3EB077598BC1C309A56A',
          _serialized: 'false_34634566654@c.us_3EB077598BC1C309A56A'
        },
        body: 'hola',
        type: 'chat',
        t: 1668841133,
        notifyName: 'Juanma',
        from: '34634566654@c.us',
        to: '34613086944@c.us',
        self: 'in',
        ack: 1,
        isNewMsg: true,
        star: false,
        kicNotified: false,
        recvFresh: true,
        isFromTemplate: false,
        thumbnail: '',
        pollInvalidated: false,
        latestEditMsgKey: null,
        latestEditSenderTimestampMs: null,
        broadcast: false,
        mentionedJidList: [],
        isVcardOverMmsDocument: false,
        labels: [],
        hasReaction: false,
        ephemeralSettingTimestamp: 1666197278,
        ephemeralOutOfSync: false,
        disappearingModeInitiator: 'chat',
        inviteGrpType: 'DEFAULT',
        productHeaderImageRejected: false,
        lastPlaybackProgress: 0,
        isDynamicReplyButtonsMsg: false,
        isMdHistoryMsg: false,
        stickerSentTs: 0,
        isAvatar: false,
        requiresDirectConnection: false,
        pttForwardedFeaturesEnabled: true,
        isEphemeral: false,
        isStatusV3: false,
        links: []
      },
      mediaKey: undefined,
      id: {
        fromMe: false,
        remote: '34634566654@c.us',
        id: '3EB077598BC1C309A56A',
        _serialized: 'false_34634566654@c.us_3EB077598BC1C309A56A'
      },
      ack: 1,
      hasMedia: false,
      body: 'hola',
      type: 'chat',
      timestamp: DateService.dayjs().unix(),
      from: '34634566654@c.us',
      to: '34613086944@c.us',
      author: undefined,
      deviceType: 'web',
      isForwarded: undefined,
      forwardingScore: 0,
      isStatus: false,
      isStarred: false,
      broadcast: false,
      fromMe: false,
      hasQuotedMsg: false,
      duration: undefined,
      location: undefined,
      vCards: [],
      inviteV4: undefined,
      mentionedIds: [],
      orderId: undefined,
      token: undefined,
      isGif: false,
      isEphemeral: false,
      links: []
    };
    this.transportService.send('whatsapp:message', {
      from: message.from,
      id: message.id.id,
      type: message.type,
      sent_at: message.timestamp,
      body: message.body,
    });
  }
}
