import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { TextObjectType, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { uuid } from './utils';

export async function contactFormModal({ currViewId, title, modify, persistence, room, data = {} as any, read, http, state }: {
    title: string,
    modify: IModify,
    persistence: IPersistence,
    room?: IRoom,
    read: IRead,
    http: IHttp,
    data: any;
    state: 'first' | 'second',
    currViewId?: string;
}): Promise<IUIKitModalViewParam> {
    const { FirstName, LastName, MailingCity, MailingState, MailingPostalCode, MailingCountry } = data;
    const viewId = currViewId || 'contactFormModal-' + uuid();

    const block = modify.getCreator().getBlockBuilder();

    switch (state) {
        case 'first': {
            block.addInputBlock({
                blockId: 'properties',
                element: block.newPlainTextInputElement({
                    actionId: 'FirstName',
                    initialValue: FirstName,
                }),
                label: block.newPlainTextObject('First Name'),
            });
            block.addInputBlock({
                blockId: 'properties',
                element: block.newPlainTextInputElement({
                    actionId: 'LastName',
                    initialValue: LastName,
                }),
                label: block.newPlainTextObject('Last Name*'),
            });
            break;
        }
        case 'second': {
            // block.addDividerBlock();
            // block.addSectionBlock({
            //     text: block.newMarkdownTextObject('*Additional Contact info*'),
            // });
            // block.addDividerBlock();
            block.addInputBlock({
                blockId: 'properties',
                element: block.newPlainTextInputElement({
                    actionId: 'MailingCity',
                    initialValue: MailingCity,
                }),
                label: block.newPlainTextObject('City'),
            });
            block.addInputBlock({
                blockId: 'properties',
                element: block.newPlainTextInputElement({
                    actionId: 'MailingState',
                    initialValue: MailingState,
                }),
                label: block.newPlainTextObject('State'),
            });
            block.addInputBlock({
                blockId: 'properties',
                element: block.newPlainTextInputElement({
                    actionId: 'MailingPostalCode',
                    initialValue: MailingPostalCode,
                }),
                label: block.newPlainTextObject('Postal Code'),
            });
            block.addInputBlock({
                blockId: 'properties',
                element: block.newPlainTextInputElement({
                    actionId: 'MailingCountry',
                    initialValue: MailingCountry,
                }),
                label: block.newPlainTextObject('Country'),
            });
            break;
        }
    }

    block.addActionsBlock({
        blockId: 'button',
        elements: [
            block.newButtonElement({
                text: block.newPlainTextObject(state === 'first' ? 'Continue' : 'Previous'),
                value: viewId,
                actionId: state === 'first' ? 'Continue' : 'Previous',
            }),
        ],
    })

    return {
        id: viewId,
        title: block.newPlainTextObject(title),
        submit: block.newButtonElement({
            text: block.newPlainTextObject('Save'),
        }),
        close: block.newButtonElement({
            text: block.newPlainTextObject('Dismiss'),
        }),
        blocks: block.getBlocks(),
    };
}
