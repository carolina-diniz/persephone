import { CommandInteraction, PermissionResolvable } from 'discord.js';

export function memberPermission(
  interaction: CommandInteraction,
  permission: PermissionResolvable,
): boolean {
  console.log(`Verificando permissão do usuário: ${interaction.user.displayName}`)
  const member = interaction.guild?.members.resolve(interaction.user.id);

  return member?.permissions.has(permission) ?? false;
}
