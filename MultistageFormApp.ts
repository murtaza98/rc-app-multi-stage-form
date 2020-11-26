import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { SlashCommand } from './commands/commands';
import { contactFormModal } from './modals';

export class MultistageFormApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
        try {
            const data = context.getInteractionData();
            console.log('Submitted Properties ---->', data.view.state);
        } catch (err) {
            this.getLogger().log(`${ err.message }`);
        }
    }

    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
        try {
            const data = context.getInteractionData();
            const { actionId, value } = data;
            switch (actionId) {
                case 'Continue': {
                    // tslint:disable-next-line: max-line-length
                    const modal = await contactFormModal({ currViewId: value, title: 'Contact form', modify, persistence, room: context.getInteractionData().room, data: {}, read, http, state: 'second' });
                    // tslint:disable-next-line: max-line-length
                    return modify.getUiController().updateModalView(modal, { triggerId: context.getInteractionData().triggerId }, context.getInteractionData().user);
                }
                case 'Previous': {
                    // tslint:disable-next-line: max-line-length
                    const modal = await contactFormModal({ currViewId: value, title: 'Contact form', modify, persistence, room: context.getInteractionData().room, data: {}, read, http, state: 'first' });
                    // tslint:disable-next-line: max-line-length
                    return modify.getUiController().updateModalView(modal, { triggerId: context.getInteractionData().triggerId }, context.getInteractionData().user);
                }
            }
        } catch (err) {
            this.getLogger().log(`${ err.message }`);
        }
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configurationExtend.slashCommands.provideSlashCommand(new SlashCommand(this));
    }
}
