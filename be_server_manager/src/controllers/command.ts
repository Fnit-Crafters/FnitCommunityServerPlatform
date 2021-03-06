import { Request, Response } from 'express';
import ServerOperatorInterface from '../domain/ServerOperatorInterface';
import ServerOperator from '../domain/ServerOperator';
import ServerOperatorMapper from '../database/ServerOperatorMapper';
import DiscordAuthor from '../entities/DiscordAuthor';
import DiscordAuthorModel from '../model/DiscordAuthorModel';
import Player from '../entities/Player';
import PlayerModel from '../model/PlayerModel';

export const discordCommand = async (request: Request, response: Response) => {
    const model: ServerOperatorInterface = new ServerOperator(new ServerOperatorMapper());

    const body = request.body;
    const author: DiscordAuthor = new DiscordAuthorModel(body.author);

    const directive: string = body.directive;
    const directiveArray: Array<string> = directive.split(' ');
    const [command, ...targets] = directiveArray;

    switch (command) {
        case 'join':
            const receiptNumber = targets[0];
            if (typeof receiptNumber === 'string') {
                const player: Player | Error = await model.joinRequestAccepter(receiptNumber, author).catch((err: Error) => {
                    return err;
                });

                if (PlayerModel.isPlayer(player)) {
                    const replyMessage = `Congratulations! 登録が完了しました!\n他のチャンネルをよく読んで楽しいマインクラフト生活を送りましょう!\nホワイトリストに登録されたプレイヤーネーム: ${player.name}`;
                    return response.send(replyMessage);
                } else {
                    response.status(400);
                    return response.send(player.message);
                }
            }
            response.status(400);
            return response.send('受付番号を入力してください. 入力の例: /fnit join 1111');
        case 'whitelist':
            const [type, ...playerNames]: Array<string> = targets;
            const playerName: string = playerNames.join(' ');

            if (typeof playerName === 'string' && (type === 'add' || type === 'remove')) {
                const result: boolean | Error = await model.whitelist(type, playerName, author).catch((err: Error) => {
                    return err;
                });

                let replyMessage = '';

                if (result instanceof Error) {
                    replyMessage = `ホワイトリストの更新に失敗しました.\n${result.message}`;
                } else if(result === true) {
                    replyMessage = `${playerName} がホワイトリスト${type === 'add' ? 'に追加さ' : 'から削除さ'}れました`;
                } else {
                    replyMessage = 'ホワイトリストの更新に失敗しました';
                }

                return response.send(replyMessage);
            }

            return response.send('対象のプレイヤー名を入力してください. 入力の例: /fnit whitelist add PlayerName');
        case 'whiteilst-remove':
            return;
        case 'restore':
            return;
        default:
            return;
    }

    // directiveを分解し, コマンドを抽出
    // 抽出されたコマンドによって, 対応するDomainを呼び出す
    // domainのインターフェースは, directiveのarguments, DiscordAuthor
    // domain内では, argumentsを条件としてdirectiveを実行. トランザクションをDiscord AuthorとともにDBに保存
    // トランザクション内で持つauthor情報はidのみとし, てきぎ, name等はDiscordAuthor Collectionに保存する (idをuidとする)

    return response.send(body.directive);
};

