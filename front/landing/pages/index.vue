<template>
<div>
  <div class="content-wrapper">
    <Header />

    <section class="wrapper bg-light pb-md-10 pb-16">
      <div class="container-card">
        <div class="card image-wrapper bg-full bg-image bg-overlay bg-overlay-light-500 mt-2 mb-5" data-image-src="@/assets/img/photos/bg22.png">
          <div class="card-body py-md-14 pt-12 px-0">
            <div class="container">
              <div class="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start">
                <div class="col-lg-6" data-cues="slideInDown" data-group="page-title" data-delay="900">
                  <h1 class="display-2 mb-4 me-xl-5 me-xxl-0">{{ $t('The assistant for organising your WhatsApp content') }}</h1>
                  <p class="lead fs-23 lh-sm mb-7 pe-xxl-15"><span class="text-primary">TextPocket</span> {{ $t('helps you get the most out of your WhatsApp messages by allowing you to easily organise them, tag them, set reminders and much more...') }}</p>
                  <div>
                    <a
                      class="btn btn-lg btn-primary rounded"
                      @click="openModal(RegisterInfo)"
                    >{{ $t('Start here') }}</a></div>
                </div>
                <div class="col-lg-6 pt-10 pt-md-0">
                  <img class="img-fluid mb-n18" src="@/assets/images/3d6.png" srcset="@/assets/images/3d6@2x.png 2x" data-cue="fadeIn" data-delay="300" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="wrapper bg-light angled lower-end">
      <div class="container pt-10 pt-md-15 pb-1">
        <div class="row text-center">
          <div class="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
            <h2 class="fs-16 text-uppercase text-primary mb-3">{{ $t('Features') }}</h2>
            <h3 class="display-4 mb-9 px-xl-11">{{ $t('Here are some of the features offered by TextPocket.') }}</h3>
          </div>
        </div>
        <div class="row gy-8 mb-17">
          <div class="col-md-6 col-lg-4">
            <div class="d-flex flex-row justify-content-center">
              <div></div>
              <div class="text-center">
                <h3 class="fs-22 mb-1">{{ $t('Message types') }}</h3>
                <p class="mb-0">{{ $t('Save all types of WhatsApp messages. But also tweets, Facebook posts...') }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="d-flex flex-row justify-content-center">
              <div></div>
              <div class="text-center">
                <h3 class="fs-22 mb-1 d-inline me-2">{{ $t('Search engine') }}</h3>
                <p class="mb-0">{{ $t('Quickly find specific messages by keyword, date or tag.') }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="d-flex flex-row justify-content-center">
              <div></div>
              <div class="text-center">
                <h3 class="fs-22 mb-1">{{ $t('Reactions') }}</h3>
                <p class="mb-0">{{ $t('Organise messages more efficiently.') }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="d-flex flex-row justify-content-center">
              <div></div>
              <div class="text-center">
                <h3 class="fs-22 mb-1">{{ $t('Notes') }}</h3>
                <p class="mb-0">{{ $t('Stores important additional information next to the message.') }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="d-flex flex-row justify-content-center">
              <div></div>
              <div class="text-center">
                <h3 class="fs-22 mb-1">{{ $t('Tags') }}</h3>
                <p class="mb-0">{{ $t('Identifies the content of the message.') }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="d-flex flex-row justify-content-center">
              <div></div>
              <div class="text-center">
                <h3 class="fs-22 mb-1 d-inline me-2">{{ $t('Reminders') }}</h3>
                <p class="mb-0">{{ $t('Schedule reminders for messages and they will be forwarded to you on the selected date.') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="wrapper bg-light angled lower-end">
      <div class="container pb-14 pt-md-0 pb-md-16">
        <div class="row">
          <div class="col text-center">
            <h2 class="fs-16 text-uppercase text-primary mb-10">{{ $t('FREQUENTLY ASKED QUESTIONS') }}</h2>
          </div>
        </div>
        <div class="row gx-md-8 gx-xl-12 gy-10">
          <div class="col-lg-6">
            <div class="d-flex flex-row">
              <div>
                <span class="icon btn btn-sm btn-circle btn-primary pe-none me-5"><i
                    class="uil uil-comment-exclamation"></i></span>
              </div>
              <div>
                <h4>{{ $t('What types of messages can I save?') }}</h4>
                <p class="mb-0">{{ $t('TextPocket allows you to save any type of message sent via chat. This includes text, images, videos, audios, files, contacts, locations and voice messages. As well as any social media posts, links, etc...') }}</p>
              </div>
            </div>
          </div>
          <!-- /column -->
          <div class="col-lg-6">
            <div class="d-flex flex-row">
              <div>
                <span class="icon btn btn-sm btn-circle btn-primary pe-none me-5"><i
                    class="uil uil-comment-exclamation"></i></span>
              </div>
              <div>
                <h4>{{ $t('How can I add reactions to messages?') }}</h4>
                <p class="mb-0">{{ $t('From the chat, assigning a reaction emoticon to a message assigns a category to identify it. For example, if you react to a message with ✈, you can use that emoticon to add the message to the travel category. This is fully configurable from within the application.') }}</p>
              </div>
            </div>
          </div>
          <!-- /column -->
          <div class="col-lg-6">
            <div class="d-flex flex-row">
              <div>
                <span class="icon btn btn-sm btn-circle btn-primary pe-none me-5"><i
                    class="uil uil-comment-exclamation"></i></span>
              </div>
              <div>
                <h4>{{ $t('How can I save notes on messages?') }}</h4>
                <p class="mb-0">{{ $t('From the chat, replying to a message saves the reply as a note of this message. Reply to the original message as many times as you want to save as many notes as you want. You can also search for notes.') }}</p>
              </div>
            </div>
          </div>
          <!-- /column -->
          <div class="col-lg-6">
            <div class="d-flex flex-row">
              <div>
                <span class="icon btn btn-sm btn-circle btn-primary pe-none me-5"><i
                    class="uil uil-comment-exclamation"></i></span>
              </div>
              <div>
                <h4>{{ $t('How do I add tags to messages?') }}</h4>
                <p class="mb-0">{{ $t('From the chat, replying to a message with #tag saves the reply as a tag of this message. You can add as many tags as you like. You can also search by tags.') }}</p>
              </div>
            </div>
          </div>
          <!-- /column -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container -->
    </section>
    <!-- /section -->

    <section class="wrapper bg-pale-navy mt-10 px-5">
      <div class="container-card">
        <div class="row gx-3 gy-10 pt-18 pb-md-18 pb-10 align-items-center">
          <div class="col-lg-6">
            <figure><img class="w-auto" src="@/assets/images/3d3.png" srcset="@/assets/images/3d3@2x.png 2x" alt="" /></figure>
          </div>
          <div class="col-lg-5 offset-lg-1">
            <h2 class="fs-16 text-uppercase text-primary mb-3">{{ $t('CONTACT') }}</h2>
            <h3 class="display-4 mb-8">{{ $t('Do you have any questions? Get in touch with us.') }}</h3>
            <div class="d-flex flex-row">
              <!-- <div></div> -->
              <div class="w-100">
                <nav class="nav social d-flex d-md-block justify-content-center w-100">
                  <a target="_blank" href="mailto:hola@textpocket.com"><i class="uil uil-envelope"></i></a>
                  <a target="_blank" href="https://twitter.com/text_pocket"><i class="uil uil-twitter"></i></a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Modal />
  <Footer />
</div>
</template>

<script setup>
import { container as Modal, openModal } from "jenesius-vue-modal";
import RegisterInfo from '@/components/register-info';
</script>
