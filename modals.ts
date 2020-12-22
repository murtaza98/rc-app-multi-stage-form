import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { uuid } from './utils';

export async function contactFormModal({ currViewId, title, modify, persistence, room, data = {} as any, read, http }: {
    title: string,
    modify: IModify,
    persistence: IPersistence,
    room?: IRoom,
    read: IRead,
    http: IHttp,
    data: any;
    currViewId?: string;
}): Promise<IUIKitModalViewParam> {
    const { FirstName, LastName } = data;
    const viewId = currViewId || 'contactFormModal-' + uuid();

    const block = modify.getCreator().getBlockBuilder();

    block.addInputBlock({
        blockId: 'properties',
        element: block.newPlainTextInputElement({
            actionId: 'FirstName',
            initialValue: FirstName,
        }),
        label: block.newPlainTextObject('First Name'),
    });

    if (LastName) {
        block.addInputBlock({
            blockId: 'properties',
            element: block.newPlainTextInputElement({
                actionId: 'LastName',
                initialValue: LastName,
            }),
            label: block.newPlainTextObject('Last Name*'),
        });
    }

    block.addActionsBlock({
        blockId: 'properties',
        elements: [
            block.newButtonElement({
                text: block.newPlainTextObject('Add LastName'),
                actionId: `add_last_name`,
                value: viewId,
            })
        ]
    })

    return {
        id: viewId,
        title: block.newPlainTextObject(title),
        submit: block.newButtonElement({
            text: block.newPlainTextObject('Confirm'),
        }),
        close: block.newButtonElement({
            text: block.newPlainTextObject('Dismiss'),
        }),
        blocks: block.getBlocks(),
    };
}
