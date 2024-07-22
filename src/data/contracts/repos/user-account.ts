export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface SaveFacebookUserAccountRepository {
  saveWithFacebook: (
    params: SaveFacebookUserAccountRepository.Params
  ) => Promise<void>;
}

export namespace SaveFacebookUserAccountRepository {
  export type Params = {
    id?: string;
    name: string;
    email: string;
    facebookId: string;
  };
}
