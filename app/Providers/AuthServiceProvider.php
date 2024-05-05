<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\PostsComments;
use App\Policies\PostCommentPolicy;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Notifications\Messages\MailMessage;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
//        PostsComments::class => PostCommentPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
//        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
//            return (new MailMessage)
//                ->subject('Подтвердите адресс Эллектронной Почты')
//                ->line('Нажмите на кнопку ниже')
//                ->action('Подтвердить', $url);
//        });
    }
}
