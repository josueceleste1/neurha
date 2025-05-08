import React, { FC, ReactNode, useState, useRef, useEffect } from "react";


export interface HeaderProps {
  /** Título principal exibido no header */
  title: string;
  /** Ícone ou logo à esquerda do título */
  icon?: ReactNode;
  /** Nome do usuário autenticado */
  userName: string;
  /** Callback para ação de logout */
  onLogout: () => void;
}