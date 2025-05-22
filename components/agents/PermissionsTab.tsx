import React from "react";
import type { PermissionsTabOption, PermissionsTabProps } from "@/types/agents";


const PermissionsTab: React.FC<PermissionsTabProps> = ({
  userSearch,
  onUserSearchChange,
  onAddUser,
  selectedUsers,
  onRemoveUser,
  users,
  teamSearch,
  onTeamSearchChange,
  onAddTeam,
  selectedTeams,
  onRemoveTeam,
  teams,
}) => {
  const inputClasses =
    "mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  const selectClasses =
    "w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition";

  const buttonClasses = "px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium shadow-sm transition-all text-sm";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Permissões de Acesso</h2>
      <p className="text-sm text-gray-600 mb-4">
        Selecione quais usuários ou equipes terão acesso a este agente
      </p>

      {/* Usuários */}
      <div>
        <label className={labelClasses}>Usuários</label>
        <div className="flex gap-2 items-center mb-2">
          <select
            value={userSearch}
            onChange={(e) => onUserSearchChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">Selecione um usuário...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddUser}
            className={buttonClasses}
          >
            Adicionar
          </button>
        </div>
        {/* Lista de usuários selecionados */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((userId) => {
            const user = users.find((u) => u.id === userId);
            if (!user) return null;
            return (
              <div
                key={user.id}
                className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs"
              >
                <span>{user.name}</span>
                <button
                  onClick={() => onRemoveUser(user.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  aria-label={`Remover ${user.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipes */}
      <div>
        <label className={labelClasses}>Equipes</label>
        <div className="flex gap-2 items-center mb-2">
          <select
            value={teamSearch}
            onChange={(e) => onTeamSearchChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">Selecione uma equipe...</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddTeam}
            className={buttonClasses}
          >
            Adicionar
          </button>
        </div>
        {/* Lista de equipes selecionadas */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTeams.map((teamId) => {
            const team = teams.find((t) => t.id === teamId);
            if (!team) return null;
            return (
              <div
                key={team.id}
                className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs"
              >
                <span>{team.name}</span>
                <button
                  onClick={() => onRemoveTeam(team.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  aria-label={`Remover ${team.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PermissionsTab;
