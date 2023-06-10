export enum ENotificationType {
  PROFILE_IN_REVIEW = 0,
  POST_IN_REVIEW = 1,
  POST_REPORT = 2,
  PROFILE_REPORT = 3,
}

export enum EUpdateProfileStatus {
  APPROVED = 0,
  REJECTED = 1,
  IN_REVIEW = 2,
}

export enum EGender {
  MALE = 0,
  FEMALE = 1,
}

export enum EMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  STICKER = 'sticker',
  AUDIO = 'audio',
  LINK = 'link',
}

export enum EPostStatus {
  IN_REVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum ETagType {
  GENERAL = 0,
  VIOLATION = 1,
}

export enum EMediaLinkType {
  POST = 'post',
  AVATAR = 'avatar',
  MESSAGE = 'message',
  COMMENT = 'comment',
}

export enum EReportType {
  USER = 0,
  POST = 1,
}

export enum EReportStatus {
  IN_REVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum EFollowType {
  FOLLOWING = 0,
  FOLLOWER = 1,
}
