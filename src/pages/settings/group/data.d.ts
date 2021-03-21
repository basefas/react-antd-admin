export interface GroupListItem {
  id: number;
  name: string;
  role_id?: number;
  role_name?: string;
}

export interface GroupCreateInfo {
  group_name: string;
  role_id: number;
}

export interface GroupUpdateInfo {
  group_name?: string;
  role_id?: number;
}
