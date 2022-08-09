import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-nft-details-page',
  templateUrl: './nft-details-page.component.html',
  styleUrls: ['./nft-details-page.component.scss']
})
export class NftDetailsPageComponent implements OnInit {

  constructor(private _titleService : Title) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._titleService.setTitle('Nft Details');

  }

  ngAfterViewInit(): void {
    $(document).ready(function(){
    $('.js-popup-open').magnificPopup({
      type: 'inline',
      preloader:true,
      fixedContentPos: true,
      closeOnBgClick : false,
      closeBtnInside : false,
      showCloseBtn :false,
      removalDelay: 200,
      callbacks: {
        beforeOpen: function beforeOpen() {
          // this.st.mainClass = this.st.el.attr('data-effect');
          setTimeout(function () {
            $('.popup__rate').focus();
            $('.popup_price .field__input').focus();
            var tmpStr = $('.popup_price .field__input').val();
            $('.popup_price .field__input').val('');
            $('.popup_price .field__input').val(tmpStr);
          }, 100);
        }
      }
    });
  })
  }

}
