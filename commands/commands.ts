import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { contactFormModal } from '../modals';

export class SlashCommand implements ISlashCommand {
    public command = 'multi-form';
    public i18nParamsExample = 'create';
    public i18nDescription = 'create';
    public providesPreview = false;

    constructor(private readonly app: IApp) { }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persistence: IPersistence): Promise<void> {
        try {
            const [command] = context.getArguments();

            if (!command) {
                return;
            }

            switch (command) {
                case 'create': {
                    const triggerId = context.getTriggerId();
                    if (!triggerId) {
                        this.app.getLogger().error('TRIGGER_UNDEFINED');
                        return;
                    }

                    const data = {
                        FirstName: 'Ken',
                    }
                    const modal = await contactFormModal({ title: 'Contact form', modify, persistence, room: context.getRoom(), data, read, http });
                    return modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
                }

                default:
                    // await this.processHelpCommand(context, read, modify);
                    break;
            }
        } catch (error) {
            // await sendRoomMessage(this.app, read, modify, context.getRoom(), 'operationFailedError');
            this.app.getLogger().error(error.message);
        }
    }
}
