use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use std::mem::size_of;
use std::slice::Iter;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("9ioCycbsGo13WasTZDxZ3cYP95HdhZPkYZRwM4NeVqvD");

const USER_NAME_LENGTH: usize = 127;
const PROFILE_URL_LENGTH: usize = 255;
const TEXT_LENGTH: usize = 255;
const VIDEO_URL_LENGTH: usize = 255;
const NUMBER_OF_ALLOWED_LIKES_SPACE: usize = 5;

#[program]
mod tiktok_solana {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateAccount>,
        name: String,
        profile_url: String,
    ) -> ProgramResult {
        let user: &mut UserAccount = &mut ctx.accounts.user;
        user.user_wallet_address = ctx.accounts.authority.key();
        user.user_name = name;
        user.user_profile_image_url = profile_url;

        msg!("User Added!");
        sol_log_compute_units();
        return Ok(());
    }

    pub fn create_video(
        ctx: Context<CreateVideo>,
        description: String,
        video_url: String,
        creator_name: String,
        creator_url: String,
    ) -> ProgramResult {
        let video = &mut ctx.accounts.video;
        video.authority = ctx.accounts.authority.key();
        video.description = description;
        video.video_url = video_url;
        video.creator_name = creator_name;
        video.creator_url = creator_url;
        video.comment_count = 0;
        video.index = 0;
        video.creator_time = ctx.accounts.clock.unix_timestamp;
        video.likes = 0;
        video.remove = 0;
        msg!("Video Added!");
        sol_log_compute_units();
        Ok(())
    }

    pub fn create_comment(ctx: Context<CreateComment>, text: String, commenter_name: String, commenter_url: String) -> ProgramResult {
        let video: &mut Account<VideoAccount> = &mut ctx.accounts.video;
        let comment: &mut Account<CommentAccount> = &mut ctx.accounts.comment;
        
        comment.authority = ctx.accounts.authority.key();
        comment.text = text;
        comment.commenter_name = commenter_name;
        comment.commenter_url = commenter_url;
        comment.index = video.comment_count;
        comment.video_time = ctx.accounts.clock.unix_timestamp;

        video.comment_count += 1;

        msg!("Comment Added!");
        sol_log_compute_units();
        Ok(())
    }

    pub fn like_video(ctx: Context<LikeVideo>) -> ProgramResult {
        let video: &mut Account<VideoAccount> = &mut ctx.accounts.video;

        let mut iter: Iter<Pubkey> = video.people_who_liked.iter();
        let user_liking_video : Pubkey = ctx.accounts.authority.key();
        video.likes += 1;
        video.people_who_liked.push(user_liking_video);

        Ok(())
    }

}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(
        init, 
        seeds= [b"user".as_ref(), authority.key().as_ref()],
        bump, 
        payer = authority,
        space = size_of::<UserAccount>() + USER_NAME_LENGTH + PROFILE_URL_LENGTH + 8
    )]
    pub user: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: UncheckedAccount<'info>,

    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct UserAccount {
    pub user_name: String,
    pub user_wallet_address: Pubkey,
    pub user_profile_image_url: String,
}


#[derive(Accounts)]
pub struct CreateVideo<'info> {

    #[account(
        init,
        seeds = [b"video".as_ref(), randomkey.key().as_ref()],
        bump,
        payer = authority,
        space = size_of::<VideoAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + PROFILE_URL_LENGTH + VIDEO_URL_LENGTH + 8 + 32 * NUMBER_OF_ALLOWED_LIKES_SPACE
    )]
    pub video: Account<'info, VideoAccount>,
    #[account(mut)]
    pub randomkey: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: UncheckedAccount<'info>,
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct VideoAccount {
    pub authority: Pubkey,
    pub description: String,
    pub video_url: String,
    pub creator_name: String,
    pub creator_url: String,
    pub comment_count: u64,
    pub index: u64,
    pub creator_time: i64,
    pub people_who_liked: Vec<Pubkey>,
    pub likes: u8,
    pub remove: i64,
}

#[derive(Accounts)]
pub struct CreateComment<'info> {

    #[account(mut)]
    pub video: Account<'info, VideoAccount>,
    #[account(
        init,
        seeds = [b"comment".as_ref(), video.key().as_ref(), video.comment_count.to_be_bytes().as_ref()],
        bump,
        payer = authority,
        space = size_of::<CommentAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + PROFILE_URL_LENGTH + VIDEO_URL_LENGTH +8
    )]
    pub comment: Account<'info, CommentAccount>,
    #[account(mut)]
    pub randomkey: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: UncheckedAccount<'info>,
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct CommentAccount {
    pub authority: Pubkey,
    pub text: String,
    pub commenter_name: String,
    pub commenter_url: String,
    pub index: u64,
    pub video_time: i64,
}

#[derive(Accounts)]
pub struct LikeVideo<'info> {
    #[account(mut)]
    pub video: Account<'info, VideoAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: UncheckedAccount<'info>,
    pub clock: Sysvar<'info, Clock>,
}