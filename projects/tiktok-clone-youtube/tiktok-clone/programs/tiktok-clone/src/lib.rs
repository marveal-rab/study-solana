use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use std::mem::size_of;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("9ioCycbsGo13WasTZDxZ3cYP95HdhZPkYZRwM4NeVqvD");

const USER_NAME_LENGTH: usize = 127;
const PROFILE_URL_LENGTH: usize = 255;
// const VIDEO_URL_LENGTH: usize = 255;

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

}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    // We must specify the space in order to initialize an account.
    // First 8 bytes are default account discriminator,
    // next 8 bytes come from NewAccount.data being type u64.
    // (u64 = 64 bits unsigned integer = 8 bytes)
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
